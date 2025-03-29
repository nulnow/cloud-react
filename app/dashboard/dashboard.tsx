import React, {useMemo, useRef, useState} from "react";
import {Button} from "~/components/button/button";
import {WithDocumentEvent} from "~/components/with-document-event/with-document-event";
import {WithState} from "~/components/with-state/with-state";
import {Input} from "~/components/input/input";
import {WithLifecycle} from "~/components/with-lifecycle/with-lifecycle";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export function Dashboard({ loaderData }: { loaderData: any }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <WithState initialState={{}}>
                {({ state, setState }) => {

                }}
            </WithState>
            <div className="flex justify-between items-center m-4 p-4 rounded-xl border-2">
                <div>
                    <h1 className="text-xl">Dashboard</h1>
                </div>
                <>
                    <Button className="bg-blue-300 hover:bg-blue-400 active:bg-blue-500" onClick={() => setIsModalOpen(true)}>
                        Create app <span className="text-xs">(or press N)</span>
                    </Button>
                    <WithDocumentEvent type="keypress">{(event) => {
                        if (event.code === "KeyN") {
                            setIsModalOpen(true)
                        }
                    }}</WithDocumentEvent>
                </>
            </div>

            {isModalOpen && (
                <div className="bg-gray-500/70 fixed top-0 left-0" style={{ width: '100vw', height: '100vh' }}>

                    <WithDocumentEvent type="keydown">
                        {(event) => {
                            if (event.code === "Escape") {
                                setIsModalOpen(false);
                            }
                        }}
                    </WithDocumentEvent>

                    <WithDocumentEvent type="keypress">
                        {(event) => {
                            if (event.code === "KeyN") {
                                setIsModalOpen(false);
                            }
                        }}
                    </WithDocumentEvent>

                    <div className="fixed bg-white rounded-xl border-2 p-4" style={{ top: "50%", left: "50%", width: 400, transform: "translate(-50%,-50%)" }}>
                        <h1 className="text-2xl">Create app modal</h1>
                        <WithLifecycle>
                            {() => {
                                const schema = useMemo(() => z.object({
                                    repository: z.string().url("Required url"),
                                    type: z.enum(["PostgreSQL", "React SPA", "Spring Boot"]),
                                }), []);

                                const {
                                    register,
                                    handleSubmit,
                                    formState: { errors },
                                } = useForm({
                                    resolver: zodResolver(schema),
                                });

                                return (
                                    <form onSubmit={handleSubmit((d) => console.log(d))}>
                                        <div>
                                            <label htmlFor="">Select app type</label>
                                        </div>
                                        <div>
                                            <select id="" {...register('type')}>
                                                <option value="PostgreSQL">PostgreSQL</option>
                                                <option value="React SPA">React SPA</option>
                                                <option value="Spring Boot">Spring Boot</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="">git repository</label>
                                        </div>
                                        <div>
                                            <Input type="text" {...register('repository')} />
                                        </div>
                                    </form>
                                );
                            }}
                        </WithLifecycle>

                        <div className="grid grid-cols-2 gap-4">
                            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            {(() => {
                                function onCreate() {
                                    setIsModalOpen(false);
                                    alert("ok");
                                }

                                return (
                                    <>
                                        <Button onClick={onCreate}>Create</Button>
                                        <WithDocumentEvent type="keypress">
                                            {(event) => {
                                                if (event.code === "Enter") {
                                                    onCreate();
                                                }
                                            }}
                                        </WithDocumentEvent>
                                    </>
                                )
                            })()}
                        </div>
                    </div>
                </div>
            )}
            <div className="m-4 p-4 rounded-xl border-2">
                <nav>
                    <ul>
                        <li>Apps</li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}
