import { Typography } from "antd";

const { Paragraph } = Typography;

const Description = ({ content }) => {
  return (
    // <Paragraph
    //   style={{ whiteSpace: "pre-line" }}
    //   dangerouslySetInnerHTML={{ __html: content }}
    // />
    <div dangerouslySetInnerHTML={{ __html: content }} />
  );
};

export default Description;
