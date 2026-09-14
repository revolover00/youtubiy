import re

with open('/app/applet/src/App.tsx', 'r') as f:
    content = f.read()

# 1. Update persistent-player style
pattern_style = re.compile(r'            opacity: playerBounds\.visible \? 1 : 0,\n            transition: "opacity 0\.2s ease-out",\n            backgroundColor: "black",\n            overflow: "hidden",\n          \}\}')

replacement_style = r'''            opacity: playerBounds.visible ? 1 : 0,
            transition: mainDragY > 0 ? "none" : "opacity 0.2s ease-out, transform 0.2s ease-out",
            transform: route.type === "watch" && mainDragY > 0 ? `translate3d(0, ${mainDragY}px, 0) scale(${1 - mainDragY * 0.0015})` : "none",
            backgroundColor: "black",
            overflow: "hidden",
          }}'''

content = pattern_style.sub(replacement_style, content)

# 2. Update setMainDragY
pattern_drag = re.compile(r'                    setMainDragY\(dy\);')
replacement_drag = r'''                    // Limit the drag to 150px max
                    const clampedY = Math.min(dy, 150);
                    setMainDragY(clampedY);'''

content = pattern_drag.sub(replacement_drag, content)

with open('/app/applet/src/App.tsx', 'w') as f:
    f.write(content)
