import { Menu } from "antd";

const renderMenuItems = (items) =>
  items.map((item) => {
    if (item.children) {
      return (
        <Menu.SubMenu
          key={item.key}
          icon={item.icon && <item.icon />}
          title={item.label}
        >
          {renderMenuItems(item.children)}
        </Menu.SubMenu>
      );
    }
    return (
      <Menu.Item key={item.key} icon={item.icon && <item.icon />}>
        {item.label}
      </Menu.Item>
    );
  });

export default renderMenuItems;
