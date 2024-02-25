import {Link, Outlet} from "react-router-dom";

export function App() {
    return (
        <main>
            <nav className="flex justify-between my-6">
                <div className="px-4">
                    <b>Trading System</b>
                </div>
                <div className="flex space-x-6">
                    <button className="border-b border-b-gray-700">
                        <Link to="/">Home</Link>
                    </button>
                    <button>Accounts</button>
                    <button>Trades</button>
                </div>
                <div></div>
            </nav>
            <Outlet/>
        </main>
    )
}

export default App
