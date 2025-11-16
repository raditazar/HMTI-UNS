import Image from 'next/image';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-6 animate-pulse">
          <Image
            src="/logo-hmti.png"
            alt="Logo HMTI UNS"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">HMTI UNS</h2>
        <p className="text-muted-foreground text-sm">Memuat...</p>
        <div className="mt-6 w-48 h-1 bg-muted rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-primary rounded-full animate-loading-bar" />
        </div>
      </div>
    </div>
  );
}