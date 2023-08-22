import React, { useEffect, useState } from "react";
// import SteamAPI from 'steamapi'
import { Alert, Button, Layout, Space } from "antd";
import { FormChangelogI } from "@/ts/index";
import { Options, query } from "@/hooks/useFetch";

interface DatabaseStepI {
  onFinish: () => void;
}

interface NotificationI {
  status: "success" | "error";
  message: string;
  changelogGame: FormChangelogI;
}

export const DatabaseStep: React.FC<DatabaseStepI> = (props) => {
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<NotificationI[]>([]);

  useEffect(() => {
    const changelogs = JSON.parse(localStorage.getItem("changelogs") || "[]");
    console.log(changelogs)
    sendChangelogs(changelogs);
  }, []);

  async function sendChangelogs(changelogs: FormChangelogI[]) {
    for (const changelogGame of changelogs) {
      try {
        const res = await query<any>("manualGame", Options.POST, undefined, changelogGame);
        setNotification((prev) => [...prev, {
          status: "success",
          message: `Added successfully`,
          changelogGame: changelogGame,
        }]);
      } catch (error: any) {
        setNotification((prev) => [...prev, {
          status: "error",
          message: error.message,
          changelogGame: changelogGame,
        }]);
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    const errorChangelogs = notification.filter((n) => n.status === "error").map((n) => n.changelogGame);
    localStorage.setItem("changelogs", JSON.stringify(errorChangelogs));
    localStorage.setItem("games", JSON.stringify(errorChangelogs));
    setLoading(false);
  }

  return (
    <Layout>
      <Layout.Content className="p-16">
        <Space direction="vertical">
          {notification.map((n) => (
            <Alert
              message={`${n.changelogGame.name}: ${n.message}`}
              type={n.status}
            />
          ))}
          {loading && <Alert message="Loading..." type="info" />}
        </Space>
      </Layout.Content>
      <Layout.Footer className="flex justify-end gap-16">
        <Button
          type="primary"
          onClick={props.onFinish}
        >
          Finish
        </Button>
      </Layout.Footer>
    </Layout>
  );
};

export default DatabaseStep;
