import React, { useEffect, useState } from "react";
// import SteamAPI from 'steamapi'
import { App, Button, Col, Form, Layout, Pagination, Row } from "antd";
import { FormChangelogI } from "@/ts/index";
import { dateToNumber, numberToDate } from "@/utils/format";
import { differenceInDays, eachMonthOfInterval } from "date-fns";
import { InputGameChangelogs } from "@/components/Form/InputGameChangelogs";

const itemsPerPage = 12;

interface ChangelogStore {
  changelogs: FormChangelogI[];
}

interface ChangelogFormStepI {
  onFinish: () => void;
}

export const ChangelogFormStep: React.FC<ChangelogFormStepI> = (props) => {
  const { notification } = App.useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const [form] = Form.useForm<ChangelogStore>();

  useEffect(() => {
    const changelogs = JSON.parse(localStorage.getItem("changelogs") || "[]");
    console.log(changelogs)
    if (changelogs.length > 0) {
      form.setFieldValue("changelogs", changelogs);
      return;
    }
    const games: FormChangelogI[] = JSON.parse(
      localStorage.getItem("games") || "[]"
    );
    for (const game of games) {
      const start = numberToDate(game.start);
      const end = numberToDate(game.end);
      let hoursLeft =
        (game.playedTime || 0) + (game.extraPlayedTime || 0) - (game.oldHours || 0);
      let achievementsLeft = (game.achievements?.[0] || 0) - (game.oldAchievements || 0);

      // if diff from oldEnd to end is less than 1 month, add 1 month
      if (game.oldEnd && differenceInDays(end, numberToDate(game.oldEnd)) < 30) {
        game.changelogs = [
          {
            achievements: achievementsLeft,
            createdAt: dateToNumber(end),
            gameId: game.id,
            hours: hoursLeft,
            state: game.state,
          },
        ];
      } else {
        const monthsOfInterval = eachMonthOfInterval({ start, end });

        // Dividir las horas y logros por el número de meses
        const achPerMonth = Math.floor(
          achievementsLeft / monthsOfInterval.length
        );
        const hoursPerMonth = Math.floor(hoursLeft / monthsOfInterval.length);
  
        game.changelogs = [];
  
        monthsOfInterval.forEach((date, i) => {
          // Si es el último changelog, agregamos los residuos
          let ach = achPerMonth;
          let hours = hoursPerMonth;
          let state = "Playing";
          if (i === monthsOfInterval.length - 1) {
            ach = achievementsLeft;
            hours = hoursLeft;
            state = game.state;
          } else {
            hoursLeft -= hoursPerMonth;
            achievementsLeft -= achPerMonth;
          }
  
          game.changelogs.push({
            achievements: ach,
            createdAt: dateToNumber(date),
            gameId: game.id,
            hours: hours,
            state: state,
          });
        });
      }
    }
    form.setFieldValue("changelogs", games);
    console.log(JSON.stringify(games));
  }, [form]);

  function handleSubmit(values: ChangelogStore) {
    console.log(values);
    localStorage.setItem("changelogs", JSON.stringify(values.changelogs));
    props.onFinish();
  }

  function handleSubmitFailed(errorInfo: any) {
    notification.error({
      message: "Errors in form",
      description: errorInfo.errorFields
        .map(
          (error: any) =>
            `${error.errors[0]} on field ${JSON.stringify(error.name[0])}`
        )
        .join("\n"),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Layout>
      <Layout.Content className="p-16">
        <Form
          form={form}
          onFinish={handleSubmit}
          onFinishFailed={handleSubmitFailed}
          noValidate
          layout="vertical"
          className="p-16"
          id="game-form"
        >
          <Form.List name="changelogs">
            {(fields, _, { errors }) => {
              // const totalPages = Math.ceil(fields.length / itemsPerPage);
              const currentFields = fields.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              );

              return (
                <Row gutter={[16, 16]}>
                  {currentFields.map(({ key, name }) => {
                    return (
                      <Col span={24} key={key}>
                        <Form.Item name={name}>
                          <InputGameChangelogs
                            fieldName={name}
                          />
                        </Form.Item>
                      </Col>
                    );
                  })}
                  <Col span={24}>
                    <Form.ErrorList errors={errors} />
                  </Col>
                  {fields.length > itemsPerPage && (
                    <Col span={24}>
                      <Pagination
                        current={currentPage}
                        total={fields.length}
                        pageSize={itemsPerPage}
                        onChange={(page) => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      />
                    </Col>
                  )}
                </Row>
              );
            }}
          </Form.List>
        </Form>
      </Layout.Content>
      <Layout.Footer className="flex justify-end gap-16">
        <Button
          type="primary"
          htmlType="submit"
          form="game-form"
        >
          Submit
        </Button>
      </Layout.Footer>
    </Layout>
  );
};

export default ChangelogFormStep;
