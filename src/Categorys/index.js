import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Title, Grid, Group, Space, Button } from "@mantine/core";
import { Table } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchCategory = async (name = "") => {
  const response = await axios.get(
    "http://localhost:1226/category?" + (name !== "" ? "name=" + name : "")
  );
  return response.data;
};

export default function Categorys() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // const [category, setCategory] = useState([]);
  const [name, setName] = useState("");
  const {
    isLoading,
    isError,
    data: categories,
    error,
  } = useQuery({
    queryKey: ["categories", name],
    queryFn: () => fetchCategory(name),
  });

  return (
    <>
      <Space h="20px" />{" "}
      <Group position="apart">
        <Title order={3} align="center">
          Item
        </Title>
        <Button
          component={Link}
          to="/add_category"
          variant="gradient"
          gradient={{ from: "yellow", to: "purple", deg: 105 }}
        >
          Add New Category
        </Button>
      </Group>
      <Space h="20px" />
      <Grid>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          {categories ? (
            categories.map((cate) => {
              return (
                <tbody>
                  <tr key={cate._id}>
                    <td>{cate.name}</td>
                  </tr>
                </tbody>
              );
            })
          ) : (
            <Grid.Col className="mt-5">
              <Space h="120px" />
            </Grid.Col>
          )}
        </Table>
      </Grid>
    </>
  );
}
