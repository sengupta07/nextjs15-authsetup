type LayoutProps = {
  children: React.ReactNode;
  params: {
    id: string;
  };
};

export default function Layout({ children }: LayoutProps) {
  return <div>{children}</div>;
}
