import React, { ReactNode, useEffect, useState } from 'react';

interface RouterProps {
  children: ReactNode;
}

export function BrowserRouter({ children }: RouterProps) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

interface RouterContextType {
  currentPath: string;
  navigate: (to: string) => void;
}

const RouterContext = React.createContext<RouterContextType>({
  currentPath: '/',
  navigate: () => {},
});

export function useRouter() {
  return React.useContext(RouterContext);
}

function navigate(to: string) {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

interface RoutesProps {
  children: ReactNode;
}

export function Routes({ children }: RoutesProps) {
  const { currentPath } = useRouter();
  
  const matchingRoute = React.Children.toArray(children).find((child) => {
    if (React.isValidElement(child)) {
      return child.props.path === currentPath;
    }
    return false;
  });

  return <>{matchingRoute}</>;
}

interface RouteProps {
  path: string;
  element: ReactNode;
}

export function Route({ element }: RouteProps) {
  return <>{element}</>;
}

interface NavigateProps {
  to: string;
}

export function Navigate({ to }: NavigateProps) {
  const { navigate } = useRouter();
  
  useEffect(() => {
    navigate(to);
  }, [to]);
  
  return null;
}

// Custom Link component for navigation
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  activeClassName?: string;
}

export function Link({ to, children, className, activeClassName, ...props }: LinkProps) {
  const { currentPath, navigate } = useRouter();
  const isActive = currentPath === to;
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      className={`${className} ${isActive && activeClassName}`}
      {...props}
    >
      {children}
    </a>
  );
}