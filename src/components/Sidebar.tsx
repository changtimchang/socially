import { currentUser } from "@clerk/nextjs/server";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

async function Sidebar() {
    const authUser = await currentUser();
    if (!authUser) return <UnAuthenticatedSidebar />;
    return (
        <aside>
            <div className="h-[1200px] border-r ">
                <div className="text-center text-xl font-semibold border-b py-4">Data management</div>
                <ul className="text-center text-lg py-4 border-b">
                    <li className="py-2"><a href="/Bom">BOM data</a></li>
                    <li className="py-2"><a href="/Cad">CAD data</a></li>
                    <li className="py-2"><a href="/Scan">SCAN data</a></li>
                </ul>
                <div className="text-center text-xl font-semibold py-12 border-b">협력사 정보</div>
                <div className="text-center text-xl font-semibold py-12">수요예측</div>
            </div>
        </aside>
    );
}

export default Sidebar;


const UnAuthenticatedSidebar = () => (
    <div className="sticky top-20">
        <Card>
            <CardHeader>
                <CardTitle className="text-center text-xl font-semibold">Welcome Back!</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground mb-4">
                    Login to access your profile and connect with others.
                </p>
                <SignInButton mode="modal">
                    <Button className="w-full" variant="outline">
                        Login
                    </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                    <Button className="w-full mt-2" variant="default">
                        Sign Up
                    </Button>
                </SignUpButton>
            </CardContent>
        </Card>
    </div>
)