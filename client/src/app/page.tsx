'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900">
          Connect with <span className="text-emerald-600">ChatNexus</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          A real-time chat application with customizable profiles and seamless communication.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/register">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <FeatureCard
          title="Real-time Chat"
          description="Send and receive messages instantly with our real-time chat system."
          icon="MessageSquare"
        />
        <FeatureCard
          title="Custom Profiles"
          description="Personalize your profile with custom colors that appear in the chat."
          icon="Palette"
        />
        <FeatureCard
          title="Secure Authentication"
          description="Your data is protected with our secure authentication system."
          icon="Shield"
        />
      </div>
    </div>
  )
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  const IconComponent = dynamic(() => 
    import("lucide-react").then((mod) => {
      const LucideIcon = mod[icon as keyof typeof mod] as React.ComponentType<any>;
      return LucideIcon;
    }), {
      ssr: false,
      loading: () => <div className="w-6 h-6" />,
    }
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col items-center text-center">
      <div className="bg-emerald-100 p-3 rounded-full mb-4">
        <IconComponent className="w-6 h-6 text-emerald-600" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}

import dynamic from "next/dynamic"
