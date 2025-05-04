import Image from "next/image";
import { fetchFromBackend } from '@/utils/socketClient';

// Function to fetch the message from Go backend
async function fetchMessageFromGoBackend() {
  try {
    const data = await fetchFromBackend('/api/message');
    return data;
  } catch (error) {
    console.error('Failed to fetch message from Go backend:', error);
    return { message: 'Error connecting to Go backend', source: 'Error' };
  }
}

// Function to fetch status information from Go backend
async function fetchStatusFromGoBackend() {
  try {
    const data = await fetchFromBackend('/api/status');
    return data;
  } catch (error) {
    console.error('Failed to fetch status from Go backend:', error);
    return { status: 'unknown', error: true };
  }
}

export default async function Home() {
  // Fetch data from Go backend in parallel
  const [messageData, statusData] = await Promise.all([
    fetchMessageFromGoBackend(),
    fetchStatusFromGoBackend()
  ]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full max-w-3xl">
        <h1 className="text-3xl font-bold">Unix Socket Demo</h1>
        
        {/* Message from backend */}
        <div className="p-6 border rounded-lg bg-slate-50 dark:bg-slate-800 w-full text-center">
          <h2 className="text-lg mb-4">Message from Go backend:</h2>
          <p className="text-xl font-semibold">{messageData.message}</p>
          <p className="text-sm text-gray-500 mt-2">Source: {messageData.source}</p>
        </div>
        
        {/* Backend status */}
        <div className="p-6 border rounded-lg bg-slate-50 dark:bg-slate-800 w-full">
          <h2 className="text-lg mb-4 text-center">Backend Status:</h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="font-semibold">Status:</div>
            <div>{statusData.status || 'unknown'}</div>
            
            <div className="font-semibold">Operating System:</div>
            <div>{statusData.os || 'unknown'}</div>
            
            <div className="font-semibold">Server Time:</div>
            <div>{statusData.time || 'unknown'}</div>
          </div>
        </div>
        
        <ol className="list-inside list-decimal text-sm/6 text-left font-[family-name:var(--font-geist-mono)] w-full">
          <li className="mb-2 tracking-[-.01em]">
            This demo uses{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              Unix sockets
            </code>
            {" "}for communication (TCP on Windows).
          </li>
          <li className="tracking-[-.01em]">
            The Go backend runs independently and Next.js fetches data from it server-side.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
