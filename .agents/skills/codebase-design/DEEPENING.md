# Deepening

How to deepen a cluster of shallow modules safely, given its dependencies. Assumes the vocabulary in [SKILL.md](SKILL.md) — **module**, **interface**, **seam**, **adapter**.

## Dependency categories

When assessing a candidate for deepening, classify its dependencies. The category determines how the deepened module is tested across its seam.

### 1. In-process

Pure computation, in-memory state, no I/O. Always deepenable — merge the modules and test through the new interface directly. No adapter needed.

### 2. Local-substitutable

Dependencies that have local test stand-ins (PGLite for Postgres, in-memory filesystem). Deepenable if the stand-in exists. The deepened module is tested with the stand-in running in the test suite. The seam is internal; no port at the module's external interface.

### 3. Remote but owned (Ports & Adapters)

Your own services across a network boundary (microservices, internal APIs). Define a **port** (interface) at the seam. The deep module owns the logic; the transport is injected as an **adapter**. Tests use an in-memory adapter. Production uses an HTTP/gRPC/queue adapter.

Recommendation shape: *"Define a port at the seam, implement an HTTP adapter for production and an in-memory adapter for testing, so the logic sits in one deep module even though it's deployed across a network."*

### 4. True external (Mock)

Third-party services (Stripe, Twilio, etc.) you don't control. The deepened module takes the external dependency as an injected port; tests provide a mock adapter.

## Seam discipline

- **One adapter means a hypothetical seam. Two adapters means a real one.** Don't introduce a port unless at least two adapters are justified (typically production + test). A single-adapter seam is just indirection.
- **Internal seams vs external seams.** A deep module can have internal seams (private to its implementation, used by its own tests) as well as the external seam at its interface. Don't expose internal seams through the interface just because tests use them.

## Extension fitness: deepen or split

Deepening is not indiscriminate compression. Before moving new behavior behind an
existing module's interface, test whether the extension earns its place:

1. **Worthy:** Which required behavior, constraint, or repeated consumer need calls for
   the capability? Do not extend merely because the code can accommodate it.
2. **Conceptual fit:** Does the capability obey the module's existing purpose,
   vocabulary, invariants, lifecycle, consistency, and failure model?
3. **Depth:** Does the extension give more leverage behind the same or a smaller
   interface, or does every caller now need to understand a new mode?
4. **Overload:** Would the module accumulate unrelated branches, optional fields,
   ordering rules, mixed lifecycles, or failure responsibilities?
5. **Residual behavior:** After using the existing module, what behavior remains that
   it cannot own coherently?

Choose among three outcomes:

- **Reuse:** The existing interface already provides the mechanism. Put domain meaning
  in the caller or a semantic module; do not create a shadow id, store, clock, or seam.
- **Deepen:** The capability fits the conceptual model and can be hidden behind a
  coherent interface that increases leverage for more than one use.
- **Split:** Residual behavior has distinct identity, lifecycle, consistency, or failure
  semantics, or the extension would make the existing module shallower. Create the
  smallest separate mechanism that owns that difference.

Compression is a design pressure, not a command. The aim is the fewest coherent
mechanisms, not the fewest nouns or modules.

Use these checks when a conceptual model is mapped to code:

- **Substrate test:** Can an existing deep module already supply the required mechanism?
- **Alias test:** Would the new identity always be one-to-one with an existing identity?
- **Clock test:** Would a new revision/version advance whenever an existing one advances?
- **Deletion test:** If the proposed mechanism vanished, would its complexity reappear,
  or would callers simply use the existing module directly?
- **Overload test:** Does reuse preserve the existing module's conceptual model and
  interface, or make unrelated callers understand the extension?

A conceptual distinction does not automatically warrant a separate implementation
mechanism. Conversely, shared mechanics do not transfer semantic ownership to the
substrate.

## Testing strategy: replace, don't layer

- Old unit tests on shallow modules become waste once tests at the deepened module's interface exist — delete them.
- Write new tests at the deepened module's interface. The **interface is the test surface**.
- Tests assert on observable outcomes through the interface, not internal state.
- Tests should survive internal refactors — they describe behaviour, not implementation. If a test has to change when the implementation changes, it's testing past the interface.
