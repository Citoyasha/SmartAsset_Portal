import { currentUser } from '@clerk/nextjs';
import Datagrid from "./components/datagrid";

async function Dashboard() {
    const user = await currentUser();
    return (
        <div>
            <Datagrid username={user?.privateMetadata} />
        </div>)
}
export default Dashboard