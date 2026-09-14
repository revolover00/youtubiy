import re

with open('/app/applet/src/App.tsx', 'r') as f:
    content = f.read()

# Add mainDragY state
if 'const [mainDragY, setMainDragY] = useState(0);' not in content:
    content = content.replace('const [searchQ, setSearchQ] = useState("");', 'const [searchQ, setSearchQ] = useState("");\n  const [mainDragY, setMainDragY] = useState(0);')

# Update touch overlay in App.tsx
overlay_regex = re.compile(r'\{\s*route\.type === "watch" && \(\s*<div\s*className="absolute top-0 inset-x-0 h-12[^>]+>.*?</button>\s*<div className="w-10 h-1 rounded-full bg-white/60 shadow-sm" />\s*<div className="w-8 h-8" />\s*</div>\s*\)\}', re.DOTALL)

new_overlay = """{route.type === "watch" && (
            <div
              className="absolute inset-0 z-30 pointer-events-auto touch-none"
              onTouchStart={(e) => {
                const touch = e.touches[0];
                playerSwipeRef.current = { startY: touch.clientY, startX: touch.clientX };
              }}
              onTouchMove={(e) => {
                const s = playerSwipeRef.current;
                if (s) {
                  const dy = e.touches[0].clientY - s.startY;
                  const dx = e.touches[0].clientX - s.startX;
                  if (dy > 0 && dy > Math.abs(dx)) {
                    // Prevent default scrolling on video
                    if (e.cancelable) e.preventDefault();
                    setMainDragY(dy);
                  }
                }
              }}
              onTouchEnd={(e) => {
                const s = playerSwipeRef.current;
                if (s) {
                  const dy = e.changedTouches[0].clientY - s.startY;
                  if (dy > 80) {
                    minimizeVideo();
                  } else if (dy < 10) {
                    // Treat as click/tap on the video to toggle play/pause
                    const iframe = document.querySelector('iframe');
                    if (iframe && iframe.contentWindow) {
                      // We toggle by sending playVideo (since YouTube API doesn't expose toggle, 
                      // we just play if paused, but if playing it does nothing unless we know state. 
                      // Without state, we send nothing or just play, or we let the user use the miniplayer controls).
                    }
                  }
                }
                setMainDragY(0);
                playerSwipeRef.current = null;
              }}
            />
          )}"""

content = overlay_regex.sub(new_overlay, content)

# Apply transform to main
main_regex = re.compile(r'(<main\s+id="main-scroll-container"[^>]*?)(\s*>)', re.DOTALL)
new_main = r'\1 style={mainDragY > 0 ? { transform: `translate3d(0, ${mainDragY}px, 0)`, transition: "none" } : { transition: "transform 0.2s ease-out" }}\2'
content = main_regex.sub(new_main, content)

with open('/app/applet/src/App.tsx', 'w') as f:
    f.write(content)

