/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using OuterInnerResource.Pn.Handlers;
using OuterInnerResource.Pn.Messages;
using Rebus.Handlers;

namespace OuterInnerResource.Pn.Installers
{
    public class RebusHandlerInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.Register(Component.For<IHandleMessages<OuterInnerResourceCreate>>().ImplementedBy<OuterInnerResourceCreateHandler>().LifestyleTransient());            
            container.Register(Component.For<IHandleMessages<OuterInnerResourceUpdate>>().ImplementedBy<OuterInnerResourceUpdateHandler>().LifestyleTransient());            
            container.Register(Component.For<IHandleMessages<OuterInnerResourceDelete>>().ImplementedBy<OuterInnerResourceDeleteHandler>().LifestyleTransient());            
            container.Register(Component.For<IHandleMessages<OuterInnerResourcePosteForm>>().ImplementedBy<OuterInnerResourcePosteFormHandler>().LifestyleTransient());            
            container.Register(Component.For<IHandleMessages<OuterInnerResourceDeleteFromServer>>().ImplementedBy<OuterInnerResourceDeleteFromServerHandler>().LifestyleTransient());            
        }
    }
}