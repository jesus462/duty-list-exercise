import type { JSX } from "react";
import { Layout, Typography } from "antd";
import { DutyInput } from "./components/DutyInput/creation/DutyInput";
import { DutyList } from "./components/DutyList/DutyList";
import { useAppHook } from "./hooks/useAppHook";
import "./App.css";

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const App = (): JSX.Element => {
  const {
    duties,
    isLoading,
    isSubmitting,
    handleCreateDuty,
    handleUpdateDuty,
    contextHolder,
  } = useAppHook();

  return (
    <Layout className="app-layout">
      {contextHolder}
      <Header className="app-header">
        <Title level={2} className="app-title">
          Duties List
        </Title>
      </Header>
      <Content className="app-content">
        <section className="input-section">
          <Paragraph className="input-description">
            Add a new duty using the input below. Press Enter or click the
            button to add it.
          </Paragraph>
          <DutyInput
            isSubmitting={isSubmitting}
            onSubmit={(value) => {
              return handleCreateDuty(value);
            }}
          />
        </section>
        <section className="list-section">
          <Title level={4} className="list-title">
            Duties
          </Title>
          <DutyList
            duties={duties}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            onUpdate={handleUpdateDuty}
          />
        </section>
      </Content>
    </Layout>
  );
};

export default App;
