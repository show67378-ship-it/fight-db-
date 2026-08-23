import Link from "next/link";
import Avatar from "@/components/Avatar";

export const metadata = {
  title: "格闘.com代表挨拶",
};

export default function CompanyMessagePage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Message</p>
      <h1 className="font-head mt-3 text-3xl font-bold text-ink">格闘.com代表挨拶</h1>

      <div className="mt-6 flex items-center gap-4">
        <Avatar name="石原しょう" sport="mma" size={64} />
        <div>
          <p className="font-head text-base font-semibold text-ink">石原 しょう</p>
          <p className="text-xs text-ink-dim">株式会社ISHIHARA SHOW 代表取締役</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="戦績" value="0-2-0" />
        <Stat label="年齢" value="31歳" />
        <Stat label="身長" value="182cm" />
        <Stat label="体重" value="120000g" />
        <Stat label="構え" value="ガニ股" />
        <Stat label="スタイル" value="突進" />
        <Stat label="得意技" value="暴飲暴食" />
        <Stat label="バックボーン" value="ゴルフ" />
      </div>

      <div className="mt-8 space-y-5 text-sm leading-relaxed text-ink">
        <p>はじめまして。株式会社ISHIHARA SHOW 代表取締役の石原しょうです。</p>

        <p>私は格闘技が大好きです。</p>

        <p>
          好きな選手を見つけ、試合を楽しみに待つ。
          <br />
          勝敗を予想し、新しい選手や団体を知り、さらに格闘技の世界にのめり込んでいく。
        </p>

        <p>そんな格闘技の魅力を、もっと多くの人に届けたい。</p>

        <p>
          その思いから生まれたのが、<strong className="font-head text-xl font-bold text-sport-mma">格闘.com</strong>です。
        </p>

        <p>
          選手や試合を知る。
          <br />
          戦績を調べる。
          <br />
          勝敗を予想する。
          <br />
          応援したい選手を見つける。
          <br />
          そして、自分でも格闘技を始めたくなったら、自分に合ったジムを探す。
        </p>

        <p>目指しているのは、単なる情報サイトではありません。</p>

        <p>
          <strong className="font-head text-xl font-bold leading-snug text-sport-mma">
            見る人、戦う人、教える人をつなぎ、格闘技に関わる人を増やしていくこと。
          </strong>
        </p>

        <p>そんな循環をつくっていきたいと考えています。</p>
      </div>

      <div className="mt-10 rounded-lg border border-accent/30 bg-accent-soft p-6">
        <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Our Mission</p>
        <p className="font-head mt-3 text-lg font-bold leading-snug text-ink">
          格闘技を、もっと知る。もっと楽しむ。もっと近くに。
        </p>
      </div>

      <div className="mt-8 space-y-5 text-sm leading-relaxed text-ink">
        <p>
          「格闘技について調べるなら格闘.com」
          <br />
          「試合を見る前には格闘.com」
          <br />
          「格闘技を始めるなら格闘.com」
        </p>
        <p>そう自然に思ってもらえる存在を目指します。</p>

        <p>
          <strong className="font-head text-xl font-bold leading-snug text-sport-mma">格闘技の入口から、その先まで。</strong>
        </p>

        <p className="pt-4 text-right">
          株式会社ISHIHARA SHOW
          <br />
          代表取締役 石原 しょう
        </p>
      </div>

      <p className="mt-10 text-sm text-ink-dim">
        <Link href="/company" className="text-accent hover:underline">
          会社概要はこちら
        </Link>
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-4 py-3 text-center">
      <p className="font-head text-[11px] font-semibold uppercase tracking-wide text-ink-dim">{label}</p>
      <p className="tabular mt-1 text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}
