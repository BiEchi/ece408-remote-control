import pyperclip
import sys

code = sys.argv[1]
pyperclip.copy(code)

print("success")
sys.stdout.flush()