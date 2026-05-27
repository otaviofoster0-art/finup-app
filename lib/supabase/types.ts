/**
 * Tipos do schema FinUp. Mantenha em sincronia com supabase/migrations/0001_init.sql.
 * Você também pode gerar automaticamente com:
 *   npx supabase gen types typescript --project-id <ref> > lib/supabase/types.ts
 */

export type Tipo = "receita" | "despesa";

export type Profile = {
  id: string;
  nome: string;
  email: string | null;
  empresa: string | null;
  cargo: string | null;
  bio: string | null;
  sonho: string | null;
  valor_sonho: number | null;
  foto_url: string | null;
  onboarding_completo: boolean;
  criado_em: string;
  atualizado_em: string;
};

export type UserCategoria = {
  id: string;
  user_id: string;
  nome: string;
  tipo: Tipo;
  emoji: string;
  cor: string;
  hex: string;
  alerta: boolean;
  ordem: number;
  criada_em: string;
};

export type Transacao = {
  id: string;
  user_id: string;
  descricao: string;
  valor: number;
  tipo: Tipo;
  categoria_id: string | null;
  data: string;
  criado_em: string;
};

export type Caixinha = {
  id: string;
  user_id: string;
  nome: string;
  meta: number;
  atual: number;
  emoji: string;
  cor_class: string;
  criada_em: string;
};

export type Post = {
  id: string;
  user_id: string;
  texto: string;
  badge: string | null;
  criado_em: string;
};

export type PostWithAuthor = Post & {
  autor_nome: string;
  autor_empresa: string | null;
  autor_cargo: string | null;
  autor_foto: string | null;
  curtidas: number;
  curtido_por_mim: boolean;
};

export type LessonProgress = {
  user_id: string;
  modulo_id: number;
  licao_id: number;
  concluida: boolean;
  acertos: number;
  xp_ganho: number;
  concluida_em: string | null;
};

/**
 * Shape esperado pelo @supabase/ssr.
 * Mantemos Insert/Update bem permissivos pra evitar atrito de tipo
 * sem perder o ganho do Row tipado nos selects.
 */
type TableShape<Row> = {
  Row: Row;
  Insert: { [key: string]: unknown };
  Update: { [key: string]: unknown };
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: TableShape<Profile>;
      user_categories: TableShape<UserCategoria>;
      transactions: TableShape<Transacao>;
      caixinhas: TableShape<Caixinha>;
      posts: TableShape<Post>;
      post_likes: TableShape<{ post_id: string; user_id: string; criado_em: string }>;
      lesson_progress: TableShape<LessonProgress>;
    };
    Views: {
      posts_with_author: { Row: PostWithAuthor; Relationships: [] };
    };
  };
};
