import re

with open('/app/applet/src/components/Watch.tsx', 'r') as f:
    content = f.read()

content = content.replace('{onMinimize && (\n            )}', '')

with open('/app/applet/src/components/Watch.tsx', 'w') as f:
    f.write(content)
