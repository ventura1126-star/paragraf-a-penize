import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LAWS, lawNumber, lawUrl } from "@/content/laws";
import { TOPICS, getTopic } from "@/content";

type Props = { params: Promise<{ topic: string }> };

export function generateStaticParams() {
  return TOPICS.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = getTopic((await params).topic);
  return { title: topic?.title, description: topic?.description };
}

export default async function TopicPage({ params }: Props) {
  const topic = getTopic((await params).topic);
  if (!topic) notFound();

  return (
    <div className="narrow">
      <nav className="breadcrumbs" aria-label="Drobečková navigace">
        <Link href="/">Úvod</Link> › <span>{topic.short}</span>
      </nav>
      <h1>{topic.title}</h1>
      <p className="lead">{topic.description}</p>

      <h2>Lekce</h2>
      <ol className="lesson-list">
        {topic.lessons.map((l, i) => (
          <li key={l.slug} className="card">
            <Link href={`/tema/${topic.slug}/${l.slug}`}>
              <div>
                <h3><span className="num">{i + 1}.</span>{l.title}</h3>
                <p className="muted" style={{ margin: 0, fontSize: "0.95rem" }}>{l.lead}</p>
              </div>
              <span className="tag">{l.minutes} min</span>
            </Link>
          </li>
        ))}
      </ol>

      <h2>Klíčové předpisy</h2>
      <ul>
        {topic.laws.map((id) => (
          <li key={id}>
            <a href={lawUrl(id)} target="_blank" rel="noopener noreferrer">
              {LAWS[id].name}
            </a>{" "}
            <span className="muted">– č. {lawNumber(id)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
