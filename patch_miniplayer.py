import re

with open('/app/applet/src/components/Miniplayer.tsx', 'r') as f:
    content = f.read()

# 1. Update handlePointerMove to apply transform instead of setting state
move_pattern = re.compile(r'    if \(dragRef\.current\.hasMoved\) \{\n      const el = containerRef\.current;\n      const width = el\?\.offsetWidth \|\| 340;\n      const height = el\?\.offsetHeight \|\| 220;\n\n      const minX = 8;\n      const maxX = Math\.max\(8, window\.innerWidth - width - 8\);\n      const minY = 8;\n      const maxY = Math\.max\(8, window\.innerHeight - height - 8\);\n\n      setPosition\(\{\n        x: Math\.max\(minX, Math\.min\(maxX, dragRef\.current\.initialX \+ dx\)\),\n        y: Math\.max\(minY, Math\.min\(maxY, dragRef\.current\.initialY \+ dy\)\),\n      \}\);\n    \}', re.DOTALL)

move_new = """    if (dragRef.current.hasMoved) {
      const el = containerRef.current;
      if (el) {
          const width = el.offsetWidth || 340;
          const height = el.offsetHeight || 220;
          const minX = 8;
          const maxX = Math.max(8, window.innerWidth - width - 8);
          const minY = 8;
          const maxY = Math.max(8, window.innerHeight - height - 8);
          
          const nextX = Math.max(minX, Math.min(maxX, dragRef.current.initialX + dx));
          const nextY = Math.max(minY, Math.min(maxY, dragRef.current.initialY + dy));
          
          // Apply transform directly for smooth 60fps drag
          el.style.transform = `translate(${nextX - dragRef.current.initialX}px, ${nextY - dragRef.current.initialY}px)`;
          
          // Optional: update a ref with the current position so we can use it in onPointerUp
          dragRef.current.lastX = nextX;
          dragRef.current.lastY = nextY;
      }
    }"""
content = move_pattern.sub(move_new, content)

# 2. Update handlePointerUp to set position state and reset transform
up_pattern = re.compile(r'  const handlePointerUp = \(e: React\.PointerEvent\) => \{\n    dragRef\.current\.dragging = false;\n    if \(isDragging\) setIsDragging\(false\);\n    \(e\.currentTarget as HTMLElement\)\.releasePointerCapture\(e\.pointerId\);\n  \};', re.DOTALL)
up_new = """  const handlePointerUp = (e: React.PointerEvent) => {
    dragRef.current.dragging = false;
    if (isDragging) {
      setIsDragging(false);
      // Commit the final position to React state and reset inline transform
      const el = containerRef.current;
      if (el) {
          el.style.transform = '';
          setPosition({ x: dragRef.current.lastX, y: dragRef.current.lastY });
      }
    }
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };"""
content = up_pattern.sub(up_new, content)

with open('/app/applet/src/components/Miniplayer.tsx', 'w') as f:
    f.write(content)
