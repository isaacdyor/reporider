import { type Repository } from "@/types/github";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";

export function RepoCard({ repo }: { repo: Repository }) {
  console.log(repo);
  return (
    <Link href={`/articles/create/${repo.name}`}>
      <Card key={repo.name}>
        <CardContent className="pt-6">
          <p>{repo.name}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
