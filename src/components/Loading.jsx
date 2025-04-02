import { Grid } from "react-awesome-spinners";

const Loading = () => {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh"
        }}>
            <Grid size={"90px"} color={"#000"} speed={500}/>
        </div>
    );
};

export default Loading;
