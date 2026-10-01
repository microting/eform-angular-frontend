using System;
using System.Reflection;
using System.Reflection.Emit;
using eFormAPI.Web.Hosting.SentryIntegration;

namespace eFormAPI.Web.Tests.SentryIntegration;

/// <summary>
/// A plugin stand-in emitted at runtime, so that stack frames really belong to another assembly
/// than the test (host) code. Every instance is a distinct assembly.
/// </summary>
public sealed class FakePluginAssembly
{
    public const string ExceptionMessage = "boom in plugin";

    private readonly Type _service;

    /// <param name="dsn">Value of the SentryDsn assembly metadata; null emits no metadata.</param>
    public FakePluginAssembly(string dsn)
    {
        Name = "FakePlugin" + Guid.NewGuid().ToString("N") + ".Pn";
        var assembly = AssemblyBuilder.DefineDynamicAssembly(
            new AssemblyName(Name) { Version = new Version(1, 2, 3, 0) }, AssemblyBuilderAccess.Run);
        if (dsn != null)
        {
            assembly.SetCustomAttribute(new CustomAttributeBuilder(
                typeof(AssemblyMetadataAttribute).GetConstructor([typeof(string), typeof(string)])!,
                [SentryPluginRouter.DsnMetadataKey, dsn]));
        }

        var type = assembly.DefineDynamicModule(Name).DefineType(
            Name + ".Service", TypeAttributes.Public | TypeAttributes.Abstract | TypeAttributes.Sealed);

        // public static void Fail() => throw new InvalidOperationException(ExceptionMessage);
        var fail = type.DefineMethod("Fail", MethodAttributes.Public | MethodAttributes.Static).GetILGenerator();
        fail.Emit(OpCodes.Ldstr, ExceptionMessage);
        fail.Emit(OpCodes.Newobj, typeof(InvalidOperationException).GetConstructor([typeof(string)])!);
        fail.Emit(OpCodes.Throw);

        // public static void Run(Action action) { action(); }  (no tail call: the frame must stay on the stack)
        var run = type.DefineMethod("Run", MethodAttributes.Public | MethodAttributes.Static,
            typeof(void), [typeof(Action)]).GetILGenerator();
        run.Emit(OpCodes.Ldarg_0);
        run.Emit(OpCodes.Callvirt, typeof(Action).GetMethod(nameof(Action.Invoke))!);
        run.Emit(OpCodes.Nop);
        run.Emit(OpCodes.Ret);

        _service = type.CreateType();
    }

    public string Name { get; }

    public Assembly Assembly => _service.Assembly;

    /// <summary>Throws from inside the plugin assembly.</summary>
    public void Fail()
    {
        try
        {
            _service.GetMethod("Fail")!.Invoke(null, null);
        }
        catch (TargetInvocationException e)
        {
            System.Runtime.ExceptionServices.ExceptionDispatchInfo.Capture(e.InnerException!).Throw();
        }
    }

    /// <summary>The exception <see cref="Fail"/> throws, with its plugin stack trace.</summary>
    public Exception CatchFailure()
    {
        try
        {
            Fail();
        }
        catch (InvalidOperationException e)
        {
            return e;
        }

        throw new InvalidOperationException("The emitted plugin did not throw.");
    }

    /// <summary>Runs <paramref name="action"/> with a plugin frame on the call stack.</summary>
    public void Run(Action action) => _service.GetMethod("Run")!.Invoke(null, [action]);
}
