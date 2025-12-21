// Use typed Tauri command wrappers instead of raw `invoke`
import { useState } from 'react';
import { toast } from 'sonner';

import './App.css';
import reactLogo from './assets/react.svg';
import { Button } from './components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/ui/card';
import { Input } from './components/ui/input';
import { greet as greetCmd } from './lib/tauri';

function App() {
  const [name, setName] = useState<string>('');

  async function greet() {
    try {
      const greetMsg: string = await greetCmd(name);
      toast(greetMsg);
    } catch {
      toast.error('Failed to greet. Please try again.');
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-100 text-zinc-950/60 dark:bg-zinc-800 dark:text-gray-100">
      <div className="absolute inset-0 -z-10 size-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px] dark:bg-black">
        <div className="absolute-center-xy animate-pulse-slow size-full bg-[radial-gradient(circle_500px_at_50%_300px,#f7b34814,transparent)]" />
      </div>
      <div className="flex justify-center">
        <a
          href="https://vitejs.dev"
          target="_blank"
          rel="noopener"
          className="font-medium text-indigo-500 hover:text-indigo-600 dark:hover:text-cyan-400">
          <img
            src="/vite.svg"
            className="h-24 p-6 transition duration-750 will-change-[filter] hover:drop-shadow-[0_0_2em_#747bff]"
            alt="Vite logo"
          />
        </a>
        <a
          href="https://tauri.app"
          target="_blank"
          rel="noopener"
          className="font-medium text-indigo-500 hover:text-indigo-600 dark:hover:text-cyan-400">
          <img
            src="/tauri.svg"
            className="h-24 p-6 transition duration-750 will-change-[filter] hover:drop-shadow-[0_0_2em_#24c8db]"
            alt="Tauri logo"
          />
        </a>
        <a
          href="https://reactjs.org"
          target="_blank"
          rel="noopener"
          className="font-medium text-indigo-500 hover:text-indigo-600 dark:hover:text-cyan-400">
          <img
            src={reactLogo}
            className="animate-spin-slow h-24 p-6 will-change-[filter] hover:drop-shadow-[0_0_2em_#61dafb]"
            alt="React logo"
          />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <Card className="mt-6 w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Tauri + React</CardTitle>
          <CardDescription>Enter your name to be greeted.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={e => {
              e.preventDefault();
              greet();
            }}>
            <div className="flex w-full items-center space-x-2">
              <Input
                id="greet-input"
                onChange={e => setName(e.currentTarget.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    greet();
                  }
                }}
                placeholder="Enter a name..."
              />
              <Button type="submit">Greet</Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <p>The greeting will appear as a toast notification.</p>
        </CardFooter>
      </Card>
    </main>
  );
}

export default App;
