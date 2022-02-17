import Chat from "./Chat";
import ChatList from "./ChatList"

const Home = () => {
    return (
        <div className="main">
            <div className="chatList">
                <ChatList />
            </div>
            <div className="chat">
                <Chat />
            </div>
        </div>
    );
};

export default Home;