import { SignIn } from "@clerk/nextjs";
import './page.css'

export default function Home() {
  return (
    <div className="signin"><SignIn redirectUrl="/dashboard" /></div>
  );
}
