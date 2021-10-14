#include <wb.h>

#define wbCheck(stmt)                                                     \
  do {                                                                    \
    cudaError_t err = stmt;                                               \
    if (err != cudaSuccess) {                                             \
      wbLog(ERROR, "CUDA error: ", cudaGetErrorString(err));              \
      wbLog(ERROR, "Failed to run stmt ", #stmt);                         \
      return -1;                                                          \
    }                                                                     \
  } while (0)

//@@ Define any useful program-wide constants here
#define TILE_WIDTH 3
#define MASK_WIDTH 3
#define MASK_RADIUS 1
#define BLOCK_WIDTH 3+(3-1) // TILE_WIDTH+(MASK_WIDTH-1)

//@@ Define constant memory for device kernel here
__constant__ float deviceKernel[MASK_WIDTH][MASK_WIDTH][MASK_WIDTH];

//@@ helper functions
__device__ int io_inside_range(int x_size, int y_size, int z_size, int x, int y, int z)
{
  if (x>=0 && y>=0 && z>=0 && x<x_size && y<y_size && z<z_size) return 1;
  else return 0;
}

__device__ int tile_inside_range(int thr_x, int thr_y, int thr_z)
{
  if (thr_x < TILE_WIDTH && thr_y < TILE_WIDTH && thr_z < TILE_WIDTH) return 1; 
  else return 0;
}

__device__ int flatten(int x_size, int y_size, int z_size, int x, int y, int z)
{
  return (z * x_size * y_size + y * x_size + x);
}

// GPU kernel function
__global__ void conv3d(float *input, float *output, const int z_size, const int y_size, const int x_size) {
  //@@ Insert kernel code here
  
  // define local variables for acceleration
  int x_out = blockIdx.x * TILE_WIDTH + threadIdx.x;
  int y_out = blockIdx.y * TILE_WIDTH + threadIdx.y;
  int z_out = blockIdx.z * TILE_WIDTH + threadIdx.z;
  int x_in = x_out - MASK_RADIUS;
  int y_in = y_out - MASK_RADIUS;
  int z_in = z_out - MASK_RADIUS;

  // construct tiled memory
  __shared__ float N_ds[BLOCK_WIDTH][BLOCK_WIDTH][BLOCK_WIDTH];
  if (io_inside_range(x_size, y_size, z_size, x_in, y_in, z_in))
    N_ds[threadIdx.z][threadIdx.y][threadIdx.x] = input[flatten(x_size, y_size, z_size, x_in, y_in, z_in)];
  else N_ds[threadIdx.z][threadIdx.y][threadIdx.x] = (float)0;

  __syncthreads();

  float element = 0;
  //if (tile_inside_range(threadIdx.x, threadIdx.y, threadIdx.z))
  if ((threadIdx.x < TILE_WIDTH) && (threadIdx.y < TILE_WIDTH) && (threadIdx.z < TILE_WIDTH))
  {
    for (int z_incre = 0; z_incre < MASK_WIDTH; z_incre++)
      for (int y_incre = 0; y_incre < MASK_WIDTH; y_incre++)
        for (int x_incre = 0; x_incre < MASK_WIDTH; x_incre++)
          // apply the convolution calculation
          element += deviceKernel[z_incre][y_incre][x_incre] * N_ds[z_incre+threadIdx.z][y_incre+threadIdx.y][x_incre+threadIdx.x];
    if (io_inside_range(x_size, y_size, z_size, x_out, y_out, z_out))
      output[flatten(x_size, y_size, z_size, x_out, y_out, z_out)] = element;
  }
  return;
}

// main function
int main(int argc, char *argv[]) {
  wbArg_t args;
  int z_size;
  int y_size;
  int x_size;
  int inputLength, kernelLength;
  float *hostInput;
  float *hostKernel;
  float *hostOutput;
  float *deviceInput;
  float *deviceOutput;

  args = wbArg_read(argc, argv);

  // Import data
  hostInput = (float *)wbImport(wbArg_getInputFile(args, 0), &inputLength);
  hostKernel =
      (float *)wbImport(wbArg_getInputFile(args, 1), &kernelLength);
  hostOutput = (float *)malloc(inputLength * sizeof(float));

  // First three elements are the input dimensions
  z_size = hostInput[0];
  y_size = hostInput[1];
  x_size = hostInput[2];
  wbLog(TRACE, "The input size is ", z_size, "x", y_size, "x", x_size);
  assert(z_size * y_size * x_size == inputLength - 3);
  assert(kernelLength == 27);

  // @@ Create local variables for accelerating computing
  int inputSize = x_size * y_size * z_size * sizeof(float); // or (inputLength - 3) * sizeof(float)
  int kernelSize = MASK_WIDTH * MASK_WIDTH * MASK_WIDTH * sizeof(float); // or kernelLength * sizeof(float)

  wbTime_start(GPU, "Doing GPU Computation (memory + compute)");

  wbTime_start(GPU, "Doing GPU memory allocation");
  //@@ Allocate GPU memory here
  // Recall that inputLength is 3 elements longer than the input data
  // because the first three elements were the dimensions
  cudaMalloc((void**) &deviceInput, inputSize);
  cudaMalloc((void**) &deviceOutput, inputSize);
  wbTime_stop(GPU, "Doing GPU memory allocation");

  wbTime_start(Copy, "Copying data to the GPU");
  //@@ Copy input and kernel to GPU here
  // Recall that the first three elements of hostInput are dimensions and
  // do not need to be copied to the gpu
  cudaMemcpy(deviceInput, hostInput+3, inputSize, cudaMemcpyHostToDevice); // for normal memory
  cudaMemcpyToSymbol(deviceKernel, hostKernel, kernelSize); // for constant memory
  wbTime_stop(Copy, "Copying data to the GPU");

  wbTime_start(Compute, "Doing the computation on the GPU");
  //@@ Initialize grid and block dimensions here
  dim3 dimBlock(BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH); // note the padding
  dim3 dimGrid(ceil((float)x_size/TILE_WIDTH), ceil((float)y_size/TILE_WIDTH), ceil((float)z_size/TILE_WIDTH));
  //@@ Launch the GPU kernel here
  conv3d<<<dimGrid, dimBlock>>>(deviceInput, deviceOutput, z_size, y_size, x_size);
  cudaDeviceSynchronize();
  wbTime_stop(Compute, "Doing the computation on the GPU");

  wbTime_start(Copy, "Copying data from the GPU");
  //@@ Copy the device memory back to the host here
  // Recall that the first three elements of the output are the dimensions
  // and should not be set here (they are set below)
  cudaMemcpy(hostOutput + 3, deviceOutput, inputSize, cudaMemcpyDeviceToHost);
  wbTime_stop(Copy, "Copying data from the GPU");

  wbTime_stop(GPU, "Doing GPU Computation (memory + compute)");

  // Set the output dimensions for correctness checking
  hostOutput[0] = z_size;
  hostOutput[1] = y_size;
  hostOutput[2] = x_size;
  wbSolution(args, hostOutput, inputLength);

  // Free device memory
  cudaFree(deviceInput);
  cudaFree(deviceOutput);

  // Free host memory
  free(hostInput);
  free(hostOutput);
  return 0;
}