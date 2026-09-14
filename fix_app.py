import re

with open('/app/applet/src/App.tsx', 'r') as f:
    content = f.read()

# Fix the duplicate urlVideoId useEffect
pattern = re.compile(r'  \}, \[urlVideoId, setRoute\]\);.*?  useEffect\(\(\) => \{\n    if \(urlVideoId\) \{', re.DOTALL)
content = pattern.sub(r'  }, [urlVideoId, setRoute]);', content)

with open('/app/applet/src/App.tsx', 'w') as f:
    f.write(content)

with open('/app/applet/src/components/Watch.tsx', 'r') as f:
    content = f.read()
    
# Fix Watch.tsx error on line 364
print(content[content.find('onMinimize'):content.find('onMinimize')+500])

