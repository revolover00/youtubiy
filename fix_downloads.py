import re

with open('/app/applet/src/components/LibraryPage.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'\s*\|\s*"Downloads"', '', content)
content = re.sub(r'\s*\|\s*"التنزيلات"', '', content)

with open('/app/applet/src/components/LibraryPage.tsx', 'w') as f:
    f.write(content)

with open('/app/applet/src/lib/appStore.ts', 'r') as f:
    content = f.read()

content = re.sub(r'\s*\|\s*"Downloads"', '', content)
content = re.sub(r'\s*\|\s*"التنزيلات"', '', content)

with open('/app/applet/src/lib/appStore.ts', 'w') as f:
    f.write(content)
