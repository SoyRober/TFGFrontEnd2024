import { Grid } from "react-awesome-spinners";

const Loading = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
        position: "relative",
      }}
    >
      <Grid size={"90px"} color={"#000"} speed={500} />
      <span style={{ 
        position: 'absolute', 
        width: '1px', 
        height: '1px', 
        padding: 0, 
        margin: '-1px', 
        overflow: 'hidden', 
        clip: 'rect(0,0,0,0)', 
        border: 0 
      }}>
        Cargando...
      </span>
    </div>
  );
};

export default Loading;
