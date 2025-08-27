import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online Tools | EvryTools',
  description: 'A collection of free and easy-to-use online tools for file conversion, image editing, text manipulation, and more. Boost your productivity with EvryTools.',
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
