import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TOPICS, getLesson } from "@/content";
import { Blocks } from "@/components/Blocks";
import { Citations } from "@/components/CitationChip";
import { Quiz } from "@/components/Quiz";

type Props = { params: Promise<{ topic: string; lesson: string }> };

export function generateStaticParams() {
  return TOPICS.flatMap((t) => t.lessons.map((l) => ({ topic: t.slug, lesson: l.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const found = getLesson(p.topic, p.lesson);
  return { title: found?.lesson.title, description: found?.lesson.lead };
}

export default async function LessonPage({ params }: Props) {
  const p = await params;
  const found = getLesson(p.topic, p.lesson);
  if (!found) notFound();
  const { topic, lesson } = found;

  const idx = topic.lessons.findIndex((l) => l.slug === lesson.slug);
  const prev = topic.lessons[idx - 1];
  const next = topic.lessons[idx + 1];

  return (
    <>
      <nav className="breadcrumbs" aria-label="Drobečková navigace">
        <Link href="/">Úvod</Link> › <Link href={`/tema/${topic.slug}`}>{topic.short}</Link> › <span>{lesson.title}</span>
      </nav>
      <div className="lesson-layout">
        <article>
          <div className="eyebrow">Lekce {idx + 1} z {topic.lessons.length} · {lesson.minutes} min čtení</div>
          <h1>{lesson.title}</h1>
          <p className="lead">{lesson.lead}</p>

          {lesson.sections.map((s, i) => (
            <section key={i} id={`s${i + 1}`} className="section">
              <h2>{s.heading}</h2>
              <div className="section-body">
                <Blocks blocks={s.blocks} />
              </div>
              <Citations cites={s.cites} />
            </section>
          ))}

          {lesson.situations.length > 0 && (
            <section id="situace" className="section">
              <h2>Modelové situace</h2>
              {lesson.situations.map((sit, i) => (
                <details key={i} className="card situation">
                  <summary>
                    <h3>{sit.title}</h3>
                    <p className="muted" style={{ margin: 0 }}>{sit.story}</p>
                  </summary>
                  <div className="answer">
                    <div className="answer-label">Jak to vidí zákon</div>
                    <p>{sit.answer}</p>
                    <Citations cites={sit.cites} />
                  </div>
                </details>
              ))}
            </section>
          )}

          <aside className="takeaways">
            <h2>Shrnutí</h2>
            <ul>
              {lesson.takeaways.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </aside>

          {lesson.quiz.length > 0 && (
            <section id="test" className="section">
              <h2>Ověřte si porozumění</h2>
              <Quiz questions={lesson.quiz} />
            </section>
          )}

          <nav className="pager" aria-label="Další lekce">
            {prev ? (
              <Link href={`/tema/${topic.slug}/${prev.slug}`} className="card">
                <div className="eyebrow">← Předchozí</div>
                {prev.title}
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/tema/${topic.slug}/${next.slug}`} className="card next">
                <div className="eyebrow">Další →</div>
                {next.title}
              </Link>
            ) : (
              <Link href="/#temata" className="card next">
                <div className="eyebrow">Hotovo →</div>
                Zpět na přehled témat
              </Link>
            )}
          </nav>
        </article>

        <aside className="toc card" aria-label="Obsah lekce">
          <strong>V této lekci</strong>
          <ol>
            {lesson.sections.map((s, i) => (
              <li key={i}><a href={`#s${i + 1}`}>{s.heading}</a></li>
            ))}
            {lesson.situations.length > 0 && <li><a href="#situace">Modelové situace</a></li>}
            {lesson.quiz.length > 0 && <li><a href="#test">Test</a></li>}
          </ol>
        </aside>
      </div>
    </>
  );
}
