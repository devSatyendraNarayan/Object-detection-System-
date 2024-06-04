
import ObjectDetection from '@/components/ObjectDetection';
export default function Home() {
  return (
    <main className=" py-4  min-h-screen w-full justify-center">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <h1 className=" text-2xl md:text-4xl md:px-6 text-center lg:text-6xl font-bold tracking-tighter select-none">
        Object Detection System
      </h1>
      <ObjectDetection />
    </main>
  );
}