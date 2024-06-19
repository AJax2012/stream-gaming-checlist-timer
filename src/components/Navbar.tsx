import { FaGear } from "react-icons/fa6";
import { MdHome } from 'react-icons/md';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui';
import { Link } from 'react-router-dom';

const Navbar = () => {

  return (
    <nav className="h-10 pb-0.5 mb-6 mx-0 w-full border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex h-full items-center justify-end">
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/"><MdHome size={18} /></Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="hover:bg-gray-100 border-b-1 border-gray-100">
              <NavigationMenuTrigger><FaGear /></NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4">
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className="px-6 py-2 hover:bg-gray-100"
                    >
                      <Link to="/customize">Customize</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem className="hover:bg-gray-100">
                    <NavigationMenuLink
                      className="px-6 py-2 hover:bg-gray-100"
                    >
                      <Link to="/settings">Settings</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
};

export default Navbar;
