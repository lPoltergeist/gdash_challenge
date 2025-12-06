import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link, useNavigate } from "react-router";
import { Button } from "../ui/button";
import { api } from "@/lib/api";
import { toast } from 'react-toastify'
import CustomToastContainer from "../toast/custom-toast";

function Navbar() {
    const notify = (msg: string) => toast(msg)
    const navigate = useNavigate()

    const logout = () => {
        api.get('/auth/logout', {
            withCredentials: true,
        }).then(() => {
            notify("Deslogado com sucesso!")
            navigate('/signin')
        }).catch((error) => {
            notify(error);
        })
    }

    return (
        <>
            <nav className="w-full h-20 flex items-center justify-between px-6 shadow">

                <div className="text-4xl text-[#F5D10D] font-semibold">
                    SkySage
                </div>

                <NavigationMenu className="ml-auto">
                    <NavigationMenuList className="flex gap-6">

                        <NavigationMenuItem>

                            <Link className="
                   !text-white 
                text-xl font-medium
                hover:!text-[#F5D10D]
                cursor-pointer
              " to="/">
                                Weather</Link>

                        </NavigationMenuItem>

                        <NavigationMenuItem>

                            <Link className="
                   !text-white 
                text-xl font-medium
                hover:!text-[#F5D10D]
                cursor-pointer
              " to="/quotable">
                                Quotable</Link>

                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <Button type='button' onClick={() => logout()}>Logout</Button>
                        </NavigationMenuItem>
                    </NavigationMenuList>


                </NavigationMenu>
                <CustomToastContainer />
            </nav>
        </>
    );
}

export default Navbar