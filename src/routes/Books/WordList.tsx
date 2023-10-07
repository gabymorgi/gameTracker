import { query } from "@/hooks/useFetch";
import { EndPoint } from "@/ts";
import { Memo } from "@/ts/books";
import { Button, Spin } from "antd";
import { useEffect, useState } from "react";
import MemoCard from "./MemoCard";

function WordList() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Memo[]>();

  async function refetch() {
    setLoading(true);
    const data = await query<Memo[]>(EndPoint.WORDS);
    setData(data);
    setLoading(false);
  }

  useEffect(() => {
    refetch();
  }, []);

  async function handleDelete(id: string) {
    setData((prev) => prev?.filter((memo) => memo.id !== id));
  }

  async function handleEdit(memo: Memo) {
    setData((prev) =>
      prev?.map((prevMemo) => {
        if (prevMemo.id === memo.id) return {
          ...prevMemo,
          ...memo,
        };
        return prevMemo;
      })
    );
  }

  return (
    <Spin spinning={loading}>
      <div className="flex flex-col gap-16">
        {data?.map((memo) => (
          <MemoCard
            key={memo.id}
            memo={memo}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        ))}
        <Button onClick={refetch}>Refetch</Button>
      </div>
    </Spin>
  );
}

export default WordList;
