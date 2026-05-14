import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center bg-background text-foreground flex-col gap-6 text-center px-4">
      <h1 className="text-9xl font-bebas text-primary tracking-widest">404</h1>
      <h2 className="text-4xl font-bebas text-white tracking-wider">PAGE NOT FOUND</h2>
      <p className="font-sans text-secondary max-w-md mx-auto">
        The page you are looking for has been moved or doesn&apos;t exist. Get back to fueling the machine.
      </p>
      <Link href="/">
        <button className="mt-4 bg-primary text-[#050507] font-sans font-bold uppercase tracking-widest px-8 py-4 hover:bg-white transition-all shadow-[0_0_15px_rgba(26,143,255,0.3)]">
          Return To Home
        </button>
      </Link>
    </div>
  );
}
