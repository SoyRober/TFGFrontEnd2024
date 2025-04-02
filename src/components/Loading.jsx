import "../styles/loading.css";
import {Circle} from "react-awesome-spinners";

const Loading = ({ }) => {
    return (
        <div>
            <Circle
                size={100}
                color={"#00BFFF"}
                className="loading"
            />
        </div>
    )
}

export default Loading;