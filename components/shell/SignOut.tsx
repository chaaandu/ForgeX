import { signOut } from '@/auth'
import { levels as copy } from '@/content/copy'

export function SignOut() {
  return (
    <form
      action={async () => {
        'use server'
        await signOut({ redirectTo: '/' })
      }}
    >
      <button type="submit" className="btn btn-quiet press text-[13px]">
        {copy.signOut}
      </button>
    </form>
  )
}
