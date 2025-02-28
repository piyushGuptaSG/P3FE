import "./App.css";
import ChatBot from "./components/ChatBot";
import styled from "styled-components";

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 10px;
`;

const Subtitle = styled.h3`
  color: #34495e;
  font-weight: normal;
  margin-top: 0;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

// eslint-disable-next-line no-unused-vars
const Footer = styled.footer`
  text-align: center;
  margin-top: 30px;
  color: #7f8c8d;
  font-size: 0.9rem;
`;

function App() {
  return (
    <AppContainer>
      <Header>
        <Title>P3 - Peak Productivity Partner</Title>
        <Subtitle>
          Analyze Confluence pages directly from URL to extract insights
        </Subtitle>
      </Header>
      <Main>
        <ChatBot />
      </Main>
 
    </AppContainer>
  );
}

export default App;
