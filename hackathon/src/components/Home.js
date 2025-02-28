import React from "react";
import ChatBot from "./ChatBot";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 10px;
  color: #2c3e50;
  text-align: center;
`;

const Subtitle = styled.h2`
  font-size: 18px;
  margin-bottom: 30px;
  color: #34495e;
  text-align: center;
  font-weight: normal;
`;

const Badge = styled.span`
  background-color: #FF9D00;
  color: white;
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 20px;
  margin-left: 10px;
  display: inline-flex;
  align-items: center;
  
  img {
    height: 18px;
    margin-right: 6px;
  }
`;

// Hugging Face icon as base64
const hfIconBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAABP0lEQVR4nK2TsUoDQRCGv70cRBAtrFIEa0s7sbOxsLJIY2FhZeED+Ao2FhYWPoKFjVhYWKWwsBBMEUgKEYJwp6tnsbdhl+QgRfzh2J355/92dmdhTJn2Xq2wAtyJcudKYXtl4+QOoMz2/mqZPQE1d7FeOd7iP+VK0/XLTvPyZRvLs9YtSP8HwD/nJc+t5Ob6nRvn+hMgPLDzExFWfn10W3mQKvLyCxFS7SSJq7stIzPxS04DEGQMqAKLubXEDIqQzCrYa5/X68DS1EzMnFKU+zMJQsRsEeDLxgYDNm6VkV+gOBgYL2gUoEjvhhVDaVuq0y8xC/xDhQTcJUDwEQH8v+6YmMREjxm3f9QFX5rK79XXZb8PUCLr+AwDwrNZAHpNjUEPSjG78+NkX0qxE/g+vAAHvt7aRZGPUcf5AvVHb3QNbrUJAAAAAElFTkSuQmCC";

const Home = () => {
  return (
    <Container>
      <Title>
        AI Agent Chatbot 
        <Badge>
          <img src={hfIconBase64} alt="Hugging Face" />
          Hugging Face
        </Badge>
      </Title>
      <Subtitle>
        Ask questions or upload documents for analysis with our intelligent assistant
      </Subtitle>
      <ChatBot />
    </Container>
  );
};

export default Home; 