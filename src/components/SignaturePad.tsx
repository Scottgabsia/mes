import React from "react";

type SignaturePadProps = {
  onChange: (dataUrl: string | null) => void;
  disabled?: boolean;
};

export const SignaturePad: React.FC<SignaturePadProps> = ({ onChange, disabled }) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const drawing = React.useRef(false);
  const inkRef = React.useRef(false);
  const [hasInk, setHasInk] = React.useState(false);

  const resize = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0f172a";
  }, []);

  React.useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const emit = () => {
    const canvas = canvasRef.current;
    if (!canvas || !inkRef.current) {
      onChange(null);
      return;
    }
    onChange(canvas.toDataURL("image/png"));
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    drawing.current = true;
    canvas?.setPointerCapture(event.pointerId);
    const { x, y } = point(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || disabled) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = point(event);
    ctx.lineTo(x, y);
    ctx.stroke();
    if (!inkRef.current) {
      inkRef.current = true;
      setHasInk(true);
    }
  };

  const onPointerUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    emit();
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    inkRef.current = false;
    setHasInk(false);
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <div className="relative rounded-xl border-2 border-slate-300 bg-[#f8f5ee] overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-28 sm:h-36 touch-none cursor-crosshair"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />
        {!hasInk && (
          <p className="absolute inset-0 flex items-center justify-center text-[11px] font-mono uppercase tracking-widest text-slate-400 pointer-events-none">
            Sign here
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={clear}
        disabled={disabled || !hasInk}
        className="text-[10px] font-mono uppercase tracking-widest text-slate-500 hover:text-blue-400 disabled:opacity-40"
      >
        Clear signature
      </button>
    </div>
  );
};
