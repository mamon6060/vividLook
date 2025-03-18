import { useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { IoMdLogOut } from "react-icons/io";
import { Layout, Menu, message } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { menuItems } from "../shared/routeItems";
import { logoutUser } from "../utils/Slices/userSlices";
import { Avatar } from "antd";
import logo from "../assets/logo/logo.png";
import { getFirstLetters } from "../helpers/getFirstLetters";
import renderMenuItems from "../components/RenderedMenuItems";
const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(
    localStorage.getItem("selectedMenuItem") || "summary"
  );
  const [hideLayout, setHideLayout] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log(userInfo.name, "user info from main layout");
  const handleMenuItemClick = (key) => {
    setSelectedMenuItem(key);
    localStorage.setItem("selectedMenuItem", key);
    navigate(`/dashboard/${key}`);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserInfo(user);
    if (!user) navigate("/");
    if (
      new Date().getTime() -
        parseInt(localStorage.getItem("lastAccessTime"), 10) >
      7 * 24 * 60 * 60 * 1000
    ) {
      setHideLayout(true); // Hide layout after 7 days
    }
    localStorage.setItem("lastAccessTime", new Date().getTime().toString());
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logoutUser());
    message.success("You have been logged out!");
    navigate("/");
  };

  return (
    <Layout hasSider className="">
      {!hideLayout && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          className="bg-secondary h-screen"
        >
          <div
            className={`text-black mx-auto font-bold text-2xl text-center rounded-full mt-5 mb-5 ${
              collapsed
                ? `w-[50px] h-[50px] leading-[50px]`
                : `w-[110px] h-[100px] leading-[110px]`
            }`}
          >
            <img src={logo} alt="Logo" />
          </div>
          <Menu
            theme="light"
            className="h-[calc(100vh-140px)] overflow-y-auto bg-secondary pb-3"
            mode="inline"
            defaultSelectedKeys={["summary"]}
            selectedKeys={[selectedMenuItem]}
            onClick={({ key }) => handleMenuItemClick(key)}
            rootClassName="custom-menu"
          >
            {renderMenuItems(menuItems)}
          </Menu>
        </Sider>
      )}
      <Layout className="h-screen">
       
        <Header className="w-full flex justify-between mx-0 px-0 items-center bg-secondary">
          <div
            onClick={() => setCollapsed(!collapsed)}
            className="px-4 text-black hover:text-black/70 bg-secondary hover:bg-secondary/70 cursor-pointer"
          >
            {collapsed ? (
              <MenuUnfoldOutlined className="text-xl" />
            ) : (
              <MenuFoldOutlined className="text-xl" />
            )}
          </div>
          <div className="flex items-center justify-center gap-2">
            {userInfo?.name && (
              <Avatar size="large" className="bg-primary">
                {getFirstLetters(userInfo.name)}
              </Avatar>
            )}
            <div
              className="px-4 cursor-pointer font-medium mr-6 text-black hover:text-black/70"
              onClick={handleLogout}
            >
              <IoMdLogOut size={30} />
            </div>
          </div>
        </Header>

        <Content className="px-5 pb-20 overflow-y-auto h-full">
          <Outlet />
        </Content>
        <h1 className="my-4 text-center">
          Developed by{" "}
          <a href="https://okobiz.com" className="font-bold text-black">
            okobiz
          </a>
        </h1>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
