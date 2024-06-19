import { FaGear } from 'react-icons/fa6';
import { MdHome } from 'react-icons/md';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from './ui';

const Navbar = () => {
  return (
    <nav className="h-12 pb-0.5 mb-6 mx-0 w-full border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex h-full items-center justify-end">
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="flex gap-3 mr-6">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/">
                  <MdHome size={22} />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/settings">
                  <FaGear size={18} />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
};

export default Navbar;
