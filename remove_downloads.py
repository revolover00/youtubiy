import re

# 1. Update App.tsx
with open('/app/applet/src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('  "التنزيلات",\n  "Downloads",\n', '')

with open('/app/applet/src/App.tsx', 'w') as f:
    f.write(content)

# 2. Update LibraryPage.tsx
with open('/app/applet/src/components/LibraryPage.tsx', 'r') as f:
    content = f.read()

content = content.replace('  | "Downloads"\n  | "التنزيلات"\n', '')
content = re.sub(r'    case "Downloads":\n    case "التنزيلات":\n      return "downloads";\n', '', content)
content = re.sub(r'    downloads: \{\n      icon: Download,\n      title: t\("downloads"\),\n      empty: t\("downloadsEmptyMessage"\),\n    \},\n', '', content)
content = content.replace('normalized === "videos" || normalized === "downloads"', 'normalized === "videos"')
# Remove Download import
content = content.replace('  Download,\n', '')

with open('/app/applet/src/components/LibraryPage.tsx', 'w') as f:
    f.write(content)

# 3. Update Sidebar.tsx
with open('/app/applet/src/components/Sidebar.tsx', 'r') as f:
    content = f.read()

content = content.replace('    { icon: Download, label: t("downloads"), id: "downloads" },\n', '')
# Remove Download import
content = content.replace('  Download,\n', '')

with open('/app/applet/src/components/Sidebar.tsx', 'w') as f:
    f.write(content)

# 4. Update appStore.ts
with open('/app/applet/src/lib/appStore.ts', 'r') as f:
    content = f.read()

content = content.replace('  | "Downloads"\n  | "التنزيلات"\n', '')

with open('/app/applet/src/lib/appStore.ts', 'w') as f:
    f.write(content)

