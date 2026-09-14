import re

with open('/app/applet/src/components/Watch.tsx', 'r') as f:
    content = f.read()

# 1. Remove ChevronDown imports and buttons
content = content.replace('  ChevronDown,\n', '')
content = re.sub(r'\s*<button[^>]*onClick=\{onMinimize\}[^>]*>.*?<ChevronDown[^>]*>.*?</button>', '', content, flags=re.DOTALL)

# 2. Refactor dragging to use DOM style for 60fps performance
drag_state_pattern = re.compile(r'  const \[dragY, setDragY\] = useState\(0\);\n')
content = drag_state_pattern.sub('', content)

drag_handlers = """  const onPointerDown = (e: React.PointerEvent) => {
    if (window.innerWidth >= 1024) return;
    // Don't drag if scrolling inside the related list on mobile
    if ((e.target as HTMLElement).closest('.related-scroll-area')) return;
    dragRef.current = {
      startY: e.clientY,
      currentY: e.clientY,
      active: true,
      moved: false,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dy = e.clientY - dragRef.current.startY;
    if (dy > 10 && !dragRef.current.moved) {
      dragRef.current.moved = true;
    }
    if (dragRef.current.moved) {
      const clampedY = Math.max(0, dy); // Allow dragging down freely
      const el = (e.currentTarget as HTMLElement).parentElement;
      if (el) el.style.transform = `translateY(${clampedY}px)`;
      dragRef.current.currentY = clampedY;
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    
    const el = (e.currentTarget as HTMLElement).parentElement;
    if (dragRef.current.currentY > 80) {
      onMinimize?.();
      if (el) el.style.transform = ''; // reset after minimizing
    } else {
      if (el) {
          el.style.transition = 'transform 0.2s cubic-bezier(0.1, 0.9, 0.2, 1)';
          el.style.transform = 'translateY(0px)';
          setTimeout(() => { el.style.transition = ''; }, 200);
      }
    }
    dragRef.current.currentY = 0;
  };"""

content = re.sub(r'  const onPointerDown = \(e: React\.PointerEvent\) => \{.*?\n  \};', drag_handlers, content, flags=re.DOTALL)
content = re.sub(r'  const onPointerMove = \(e: React\.PointerEvent\) => \{.*?\n  \};', '', content, flags=re.DOTALL)
content = re.sub(r'  const onPointerUp = \(\) => \{.*?\n  \};', '', content, flags=re.DOTALL)

# 3. Remove inline style that used dragY
content = re.sub(r'      style=\{\{ transform: `translateY\(\$\{dragY\}px\)` \}\}', '', content)

with open('/app/applet/src/components/Watch.tsx', 'w') as f:
    f.write(content)
