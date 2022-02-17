import Chat from "./Chat";
import ChatList from "./ChatList"

const Home = () => {
    return (
        <div className="main">

                <ChatList />
                <Chat />
        </div>
    );
};

export default Home;