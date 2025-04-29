import React from "react";
import { Layout as AntLayout, Menu, Typography } from "antd";
import { Link, Outlet } from "react-router-dom";

const { Header, Content, Footer } = AntLayout;
const { Title } = Typography;

const Layout: React.FC = () => {
  return (
    <AntLayout className="min-h-screen">
      <Header className="flex items-center">
        <Link to="/" className="flex items-center">
          <div className="text-white text-xl font-bold mr-6">
            Product Manager
          </div>
        </Link>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              label: <Link to="/">Products</Link>,
            },
          ]}
          className="flex-1"
        />
      </Header>
      <Content className="p-6">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </Content>
      <Footer className="text-center">
        All Rights Reserved · Product Manager ©{new Date().getFullYear()}{" "}
      </Footer>
    </AntLayout>
  );
};

export default Layout;
