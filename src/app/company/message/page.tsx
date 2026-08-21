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
        <Stat label="体重" value="125kg" />
        <Stat label="構え" value="ガニ股" />
        <Stat label="スタイル" value="突進" />
        <Stat label="得意技" value="暴飲暴食" />
        <Stat label="バックボーン" value="ゴルフ" />
      </div>
      <p className="mt-2 text-[11px] text-ink-dim">※ 代表は選手ではありません(ネタ枠)。</p>

      <div className="mt-8 space-y-5 text-sm leading-relaxed text-ink">
        <p>はじめまして。株式会社ISHIHARA SHOW 代表取締役の石原しょうです。</p>

        <p>私は格闘技が大好きです。</p>

        <p>
          好きな選手を見つけ、その選手の試合を楽しみに待つ。
          <br />
          試合前には「どちらが勝つだろう」と予想し、勝敗に一喜一憂する。
          <br />
          そこから新しい選手や団体を知り、さらに格闘技の世界にのめり込んでいく。
        </p>

        <p>一人の格闘技ファンとして、そんな体験を何度も重ねてきました。</p>

        <p>
          以前、私は警察職員として働いていました。
          <br />
          安定した環境にいながらも、次第に「自分の力でゼロから何かを生み出したい」「自分が本当に好きなものを仕事にしたい」という思いが強くなり、退職して起業する道を選びました。
        </p>

        <p>そのとき、最初に挑戦したいと思ったのが格闘技でした。</p>

        <p>
          <strong className="font-head text-xl font-bold leading-snug text-sport-mma">格闘技を、もっと知れる。</strong>
          <br />
          <strong className="font-head text-xl font-bold leading-snug text-sport-mma">もっと楽しめる。</strong>
          <br />
          <strong className="font-head text-xl font-bold leading-snug text-sport-mma">もっと身近に感じられる場所をつくりたい。</strong>
        </p>

        <p>
          その思いから生まれたのが、<strong className="font-head text-xl font-bold text-sport-mma">格闘.com</strong>です。
        </p>

        <p>
          格闘.comは、MMA、ブラジリアン柔術、キックボクシング、ボクシングなど、競技や団体の垣根を越えて、格闘技を楽しむための情報と体験を集めていくプラットフォームです。
        </p>

        <p>
          選手を知る。
          <br />
          試合を知る。
          <br />
          戦績を調べる。
          <br />
          勝敗を予想する。
          <br />
          見たい対戦カードに投票する。
          <br />
          応援したい選手を見つける。
          <br />
          そして、自分でも格闘技を始めたくなったら、自分に合ったジムを探す。
        </p>

        <p>私たちがつくりたいのは、単なる格闘技情報サイトではありません。</p>

        <p>
          <strong className="font-head text-xl font-bold leading-snug text-sport-mma">見るだけだったファンが、格闘技の世界にもっと参加できる場所。</strong>
        </p>

        <p>それが、格闘.comの目指す姿です。</p>

        <p>格闘技の世界には、まだ十分に知られていない選手、ジム、大会、そして数え切れないほどの物語があります。</p>

        <p>
          スター選手だけではなく、これから大きく羽ばたいていく選手にも光が当たる。
          <br />
          地域で格闘技を支えているジムを、新しい人が見つけられる。
          <br />
          まだ格闘技を知らない人が、一人の選手や一つの試合をきっかけにファンになる。
        </p>

        <p>そして、</p>

        <p>
          <strong className="font-head text-xl font-bold leading-snug text-sport-mma">知る人が増える。</strong>
          <br />
          <strong className="font-head text-xl font-bold leading-snug text-sport-mma">見る人が増える。</strong>
          <br />
          <strong className="font-head text-xl font-bold leading-snug text-sport-mma">応援する人が増える。</strong>
          <br />
          <strong className="font-head text-xl font-bold leading-snug text-sport-mma">実際に格闘技を始める人が増える。</strong>
        </p>

        <p>そんな循環を生み出していくことが、格闘.comの使命だと考えています。</p>
      </div>

      <div className="mt-10 rounded-lg border border-accent/30 bg-accent-soft p-6">
        <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Our Mission</p>
        <p className="font-head mt-3 text-lg font-bold leading-snug text-ink">
          格闘技を、もっと知る。もっと楽しむ。もっと近くに。
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          格闘.comは、ファン、選手、ジム、大会、そして格闘技に関わるすべての人をつなぐ場所を目指します。
        </p>
      </div>

      <div className="mt-8 space-y-5 text-sm leading-relaxed text-ink">
        <p>いつか、</p>
        <p>
          「格闘技について調べるなら格闘.com」
          <br />
          「試合を見る前には格闘.com」
          <br />
          「格闘技を始めるなら格闘.com」
        </p>
        <p>そう自然に思ってもらえる存在になることが、私たちの目標です。</p>

        <p>まだ始まったばかりのサービスです。</p>

        <p>
          だからこそ、完成されたものを一方的に提供するのではなく、ファン、選手、ジム、格闘技に関わる皆さまの声を取り入れながら、格闘.comそのものを一緒につくり上げていきたいと思っています。
        </p>

        <p>
          格闘技には、人を熱狂させる力があります。
          <br />
          その魅力を、もっと多くの人へ。
        </p>

        <p>
          <strong className="font-head text-xl font-bold leading-snug text-sport-mma">格闘技の入口から、その先まで。</strong>
        </p>

        <p>格闘.comを、日本の格闘技を代表するプラットフォームへ育てていきます。</p>

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
